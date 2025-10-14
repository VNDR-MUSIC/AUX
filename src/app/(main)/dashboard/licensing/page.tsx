
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateLicenseRequestForm from '@/components/licensing/create-request-form';
import ManageLicenseRequests from '@/components/licensing/manage-requests';
import { useUser } from "@/firebase";
import { useOnboarding } from "@/hooks/use-onboarding";

export default function LicensingPage() {
  const { user } = useUser();
  useOnboarding('licensing');

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create">Create Request</TabsTrigger>
          <TabsTrigger value="manage" disabled={!user}>Manage Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateLicenseRequestForm />
        </TabsContent>
        <TabsContent value="manage">
          {user ? <ManageLicenseRequests /> : (
            <div className="text-center py-16 text-muted-foreground">
              <p>You must be logged in to manage license requests.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
