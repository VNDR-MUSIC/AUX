
'use client';

import { Bell, Mail, Smartphone } from "lucide-react";
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

const notificationSettings = [
  { id: 'licenseRequests', label: 'New License Requests', description: 'When a user requests to license one of your tracks.' },
  { id: 'offers', label: 'Offers & Sales', description: 'When a user makes an offer or purchases a license.' },
  { id: 'auctions', label: 'Auction Activity', description: 'When you are outbid, or an auction you are in is ending soon.' },
  { id: 'vsdTokens', label: 'VSD Token Updates', description: 'Reminders for daily token claims and balance updates.' },
  { id: 'comments', label: 'New Comments', description: 'When another user comments on your tracks or profile.' },
  { id: 'platformUpdates', label: 'Platform News', description: 'Updates, news, and announcements from the VNDR team.' },
];

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
       <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and notification preferences.</p>
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
                                        {setting.id === 'vsdTokens' ? <><Icons.vsd className="h-4 w-4" /> Token Updates</> : setting.label}
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
                                        <Switch id={`${setting.id}-push`} />
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
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage your subscription and payment methods.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button variant="outline" className="w-full">Manage Subscription</Button>
                     <Button variant="outline" className="w-full">View Payment History</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
