
'use client';

import { useUser } from '@/firebase';
import { useOnboarding } from '@/hooks/use-onboarding';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateLicenseRequestForm from '@/components/licensing/create-request-form';
import ManageLicenseRequests from '@/components/licensing/manage-requests';

export default function LicensingPage() {
  useOnboarding('licensing');
  const { user } = useUser();

  if (!user) {
    return (
       <div className="container mx-auto py-8">
         <CreateLicenseRequestForm />
       </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Licensing Center</h1>
        <p className="mt-2 text-muted-foreground">
          Submit and manage music license requests.
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Request</TabsTrigger>
          <TabsTrigger value="manage">Manage My Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="mt-6">
          <CreateLicenseRequestForm />
        </TabsContent>
        <TabsContent value="manage" className="mt-6">
          <ManageLicenseRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
