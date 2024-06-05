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
import { Banknote, LucideCoins, LucideBinary, LucideLock } from 'lucide-react';
import { useAccount } from 'wagmi';
import { createPublicClient, http, } from 'viem';
import testnet from '@/config/chains/vcTestnet'
import ContractSFCAbi from '@/config/contracts/stake';
import SFCAbi from '@/config/contracts/sfc';
const SFC_ADDRESS = '0xFC00FACE00000000000000000000000000000000';
const STAKE_ADDRESS = '0x6b39bcd174DddF5A17d065822BDC43353eB6112A';

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
    /* const [isClaiming, setIsClaiming] = useState(false); */

    const client = createPublicClient({
        chain: testnet,
        transport: http('https://vinufoundation-rpc.com'),
    });

    const { address } = useAccount();

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
                const sortedActiveValidators: any = [];
                const checkStaked = await Promise.all(sortedValidators.map(async (validator: any) => {
                    const staked = await client.readContract({
                        address: SFC_ADDRESS,
                        abi: SFCAbi,
                        functionName: 'getStake',
                        args: [address, validator],
                    });
                    if (staked == 0) {
                        return 0;
                    }

                    sortedActiveValidators.push(validator);
                    return { validator, staked };
                }));

                const getLockTime = await Promise.all(sortedActiveValidators.map(async (validator: any) => {
                    const lockTime: any = await client.readContract({
                        address: SFC_ADDRESS,
                        abi: SFCAbi,
                        functionName: "getLockedStake",
                        args: [address, validator],
                    });


                    return { validator, lockTime };
                }));

                const getUnlockedDelegation = await Promise.all(sortedActiveValidators.map(async (validator: any) => {
                    const unlockedDelegation: any = await client.readContract({
                        address: SFC_ADDRESS,
                        abi: SFCAbi,
                        functionName: 'getUnlockedStake',
                        args: [address, validator],
                    });

                    const final = unlockedDelegation / BigInt(10 ** 18);

                    return { validator, final };
                }));

                const pendingRewards = await Promise.all(sortedActiveValidators.map(async (validator: any) => {
                    const pendingRewards: any = await client.readContract({
                        address: SFC_ADDRESS,
                        abi: SFCAbi,
                        functionName: 'pendingRewards',
                        args: [address, validator],
                    });

                    const final = pendingRewards / BigInt(10 ** 18);

                    return { validator, final };
                }));

                const validatorInfo: any = await Promise.all(sortedActiveValidators.map(async (validator: any) => {
                    const info: any = await client.readContract({
                        address: STAKE_ADDRESS,
                        abi: ContractSFCAbi,
                        functionName: 'getInfo',
                        args: [validator],
                    });

                    const additionalData = await fetchAdditionalData(info);
                    const checkStakedData: any = checkStaked.find((v: any) => v.validator === validator);
                    const unlockedDelegationData: any = getUnlockedDelegation.find((v: any) => v.validator === validator);
                    const lockTimeData: any = getLockTime.find((v: any) => v.validator === validator);
                    const pendingRewardsData: any = pendingRewards.find((v: any) => v.validator === validator);
                    var realLockData = unlockedDelegationData.final - lockTimeData.lockTime;
                    if (realLockData < 0) {
                        realLockData = 0;
                    }

                    return { ...additionalData, validator, unlockedDelegationData: unlockedDelegationData.final, LockTimeData: lockTimeData.lockTime, realLockData, pendingRewardsData: pendingRewardsData.final };
                }));

                setValidators(validatorInfo);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchValidatorData();
    }, [address]);

    /*   const claimRewards = async (validator: any) => {
   
           try {
               const { writeContract } = useWriteContract()
               const gasEstimate = await client.estimateContractGas({
                   address: SFC_ADDRESS,
                   abi: SFCAbi,
                   functionName: "claimRewards",
                   args: [validator],
               });
   
               writeContract({
                   address: SFC_ADDRESS,
                   abi: SFCAbi,
                   gas: gasEstimate,
                   functionName: "claimRewards",
                   args: [validator],
               });
   
               alert('Rewards claimed successfully!');
           } catch (error) {
               console.error('Error claiming rewards:', error);
               alert('Failed to claim rewards.');
           }
       };
       */

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
                Delegator Dashboard.
            </p>
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
                                <Banknote /> {validator.realLockData ? formatNumber(validator.realLockData) : '0'}
                            </p>
                            <p className="flex items-center gap-3">
                                <LucideLock /> {validator.LockTimeData ? formatNumber(validator.LockTimeData) : '0'}
                            </p>
                            <p className="flex items-center gap-3">
                                <LucideCoins /> {validator.pendingRewardsData ? formatNumber(validator.pendingRewardsData) : '0'}
                            </p>

                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" /*onClick={() => claimRewards(validator.validator)}*/>Claim Rewards</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    );
}