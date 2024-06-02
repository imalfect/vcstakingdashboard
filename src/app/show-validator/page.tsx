'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Banknote, LucideCoins, LucideHandCoins, LucideBinary, LucideLock } from 'lucide-react';
import { createPublicClient, http } from 'viem';
import mainnet from '@/config/chains/vcMainnet';
import ContractSFCAbi from '@/config/contracts/stake';
import SFCAbi from '@/config/contracts/sfc';

const SFC_ADDRESS = '0xFC00FACE00000000000000000000000000000000';
const STAKE_ADDRESS = '0xb914a0b16111BaB228ae6214e6E1FD4a5EaE877C';

const client = createPublicClient({
    chain: mainnet,
    transport: http('https://vinuchain-rpc.com'),
});

async function fetchAdditionalData(url: string) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    try {
        const response = await fetch(proxyUrl + url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching additional data:', error);
        return {};
    }
}



export default function ValidatorCard() {
    const [validators, setValidators] = useState([]);

    useEffect(() => {
        async function fetchValidatorData() {
            try {
                const currentEpoch = await client.readContract({
                    address: SFC_ADDRESS,
                    abi: SFCAbi,
                    functionName: 'currentEpoch',
                });

                const activeValidators: any = await client.readContract({
                    address: SFC_ADDRESS,
                    abi: SFCAbi,
                    functionName: 'getEpochValidatorIDs',
                    args: [currentEpoch],
                });

                const sortedValidators = activeValidators.sort((a: any, b: any) => (a > b ? 1 : -1));


                const validatorTotalStake: any = await Promise.all(sortedValidators.map(async (validator: any) => {
                    const validatorStake: any = await client.readContract({
                        address: SFC_ADDRESS,
                        abi: SFCAbi,
                        functionName: 'getValidator',
                        args: [validator],
                    });

                    const raw: any = (validatorStake[3]);
                    const validatorWallet: any = validatorStake[6];
                    const finalInfo: any = BigInt(raw) / BigInt(10 ** 18);

                    return { validator, totalStake: finalInfo, wallet: validatorWallet };
                }));

                const validatorSelfStake: any = await Promise.all(sortedValidators.map(async (validator: any) => {
                    const validatorSelfStake: any = await client.readContract({
                        address: SFC_ADDRESS,
                        abi: SFCAbi,
                        functionName: 'getSelfStake',
                        args: [validator],
                    });

                    const finalInfo: any = BigInt(validatorSelfStake) / BigInt(10 ** 18);

                    return { validator, selfStake: finalInfo };
                }));

                const lockedStake = await Promise.all(sortedValidators.map(async (validator: any) => {
                    const wallet = validatorTotalStake.find((v: any) => v.validator === validator).wallet;
                    const lockedStakeNumber: any = await client.readContract({
                        address: SFC_ADDRESS,
                        abi: SFCAbi,
                        functionName: 'getLockupInfo',
                        args: [wallet, validator],
                    });

                    const today = new Date();
                    const currentTime = today.getTime();
                    const epochTime = Number(lockedStakeNumber[2]) * 1000;
                    const remainingTime = epochTime - currentTime;
                    const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

                    return { validator, lockedStake: remainingDays };
                })
                );

                const validatorDelegatedStake: any = await Promise.all(sortedValidators.map(async (validator: any) => {

                    const totalStakeData = validatorTotalStake.find((v: any) => v.validator === validator);
                    const selfStakeData = validatorSelfStake.find((v: any) => v.validator === validator);
                    const finalInfo = BigInt(totalStakeData.totalStake) - BigInt(selfStakeData.selfStake);

                    return { validator, delegatedStake: finalInfo };
                }));


                const validatorInfo: any = await Promise.all(sortedValidators.map(async (validator: any) => {
                    const info: any = await client.readContract({
                        address: STAKE_ADDRESS,
                        abi: ContractSFCAbi,
                        functionName: 'getInfo',
                        args: [validator],
                    });


                    const additionalData = await fetchAdditionalData(info);
                    const totalStakeData = validatorTotalStake.find((v: any) => v.validator === validator);
                    const validatorSelfStakeData = validatorSelfStake.find((v: any) => v.validator === validator);
                    const DelegatedData = validatorDelegatedStake.find((v: any) => v.validator === validator);
                    const lockedStakeData = lockedStake.find((v: any) => v.validator === validator);

                    return { ...additionalData, validator, totalStake: totalStakeData.totalStake, selfStake: validatorSelfStakeData.selfStake, delegatedStake: DelegatedData.delegatedStake, lockedStake: lockedStakeData.lockedStake };
                }));

                setValidators(validatorInfo);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchValidatorData();
    }, []);

    const formatNumber = (number: any) => {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number);
    };

    const defaultImage = 'https://gotbit-vinu-update-validator-backet-dev.s3.us-east-1.amazonaws.com/validators/vita_inu.png';
    const defaultContact = 'vinuscan.com';
    const defaultName = 'Unknown';

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-5 text-black">
            <h1 className="text-4xl font-bold mb-2">Delegate</h1>
            <p className="text-lg mb-4">
                It's time to choose the validator you'd like to support.
            </p>
            <span className="text-sm mb-6">
                TIP: Click on a validator's name to learn more about them!
            </span>
            <div className="flex flex-wrap gap-6 justify-center">
                {validators.map((validator: any, index) => (
                    <Card key={index} className="w-80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={validator.logoUrl || defaultImage} />
                                    <AvatarFallback>{validator.name || defaultName}</AvatarFallback>
                                </Avatar>
                                {validator.name || defaultName}
                            </CardTitle>
                            <CardDescription>{validator.contact || defaultContact}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <p className="flex items-center gap-3">
                                <LucideBinary /> {Number(validator.validator) ? Number(validator.validator) : 'VC Validator'}
                            </p>
                            <p className="flex items-center gap-3">
                                <LucideCoins /> {validator.selfStake ? formatNumber(validator.selfStake) : 'VC Self-stake'}
                            </p>
                            <p className="flex items-center gap-3">
                                <LucideHandCoins /> {validator.delegatedStake ? formatNumber(validator.delegatedStake) : 'VC Delegated'}
                            </p>
                            <p className="flex items-center gap-3">
                                <Banknote /> {validator.totalStake ? formatNumber(validator.totalStake) : 'VC Total stake'}
                            </p>
                            <p className="flex items-center gap-3">
                                <LucideLock /> {validator.lockedStake ? validator.lockedStake : 'VC Locked stake'}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Choose this validator</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    );
}