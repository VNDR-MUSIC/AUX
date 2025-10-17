
'use client';

import { Bell, Mail, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { useOnboarding } from "@/hooks/use-onboarding";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useWeb3Store } from "@/store/web3-store";

const notificationSettings = [
  { id: 'licenseRequests', label: 'Licensing & Contracts', description: 'When you receive a license request or a contract needs your signature.' },
  { id: 'sales', label: 'Sales & Payouts', description: 'When a license is purchased or a payout is initiated.' },
  { id: 'workUpdates', label: 'Work Processing', description: 'Updates on your work: audio analysis, credit detection, and publishing.' },
  { id: 'vsdTokens', label: 'VSD Token & Wallet', description: 'Reminders for daily rewards and significant wallet activity.' },
  { id: 'platformUpdates', label: 'Platform News', description: 'Updates, news, and announcements from the VNDR team.' },
];

export default function SettingsPage() {
  useOnboarding('settings');
  const { isWeb3Enabled, toggleWeb3 } = useWeb3Store();
  
  return (
    <div className="container mx-auto py-8">
       <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account, wallet, and notification preferences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Choose how you want to be notified about activity on your account.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {notificationSettings.map((setting, index) => (
                        <div key={setting.id}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <Label htmlFor={setting.id} className="font-semibold flex items-center gap-2">
                                        {setting.id === 'vsdTokens' ? <><Icons.vsd className="h-4 w-4" /> Token & Wallet</> : setting.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch id={`${setting.id}-app`} defaultChecked />
                                        <Label htmlFor={`${setting.id}-app`}><Bell className="h-4 w-4" /></Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Switch id={`${setting.id}-email`} defaultChecked />
                                        <Label htmlFor={`${setting.id}-email`}><Mail className="h-4 w-4" /></Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Switch id={`${setting.id}-push`} disabled />
                                        <Label htmlFor={`${setting.id}-push`}><Smartphone className="h-4 w-4" /></Label>
                                    </div>
                                </div>
                            </div>
                            {index < notificationSettings.length - 1 && <Separator className="mt-6" />}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your public profile and account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button variant="outline" className="w-full">Edit Profile</Button>
                     <Button variant="outline" className="w-full">Change Password</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5"/> Web3 Integration</CardTitle>
                    <CardDescription>Connect your Web3 wallet to enable ERC-20 VSD token conversions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label htmlFor="web3-toggle">Enable Web3 Features</Label>
                        <Switch id="web3-toggle" checked={isWeb3Enabled} onCheckedChange={toggleWeb3} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="wallet-address" className={!isWeb3Enabled ? "text-muted-foreground" : ""}>ERC-20 Address</Label>
                        <Input id="wallet-address" placeholder="0x..." disabled={!isWeb3Enabled}/>
                     </div>
                     <Button variant="secondary" className="w-full" disabled={!isWeb3Enabled}>Connect Wallet</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
