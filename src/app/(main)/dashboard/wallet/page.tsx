
'use client';

import { useUser, useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';

type Transaction = {
  id: string;
  amount: number;
  type: string;
  details: string;
  transactionDate: Timestamp;
};

export default function WalletPage() {
  const { user } = useUser();
  const { firestore } = useFirebase();

  // FIX: Point to the user document in the 'users' collection, not 'wallets'.
  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const transactionsQuery = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'vsd_transactions'),
            where('userId', '==', user.uid),
            orderBy('transactionDate', 'desc')
          )
        : null,
    [firestore, user]
  );
  const { data: transactions, isLoading: areTransactionsLoading } = useCollection<Transaction>(transactionsQuery);

  const isLoading = isUserDocLoading || areTransactionsLoading;

  const formatDate = (timestamp: Timestamp | Date) => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getTransactionIcon = (amount: number) => {
    return amount > 0 ? (
      <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
        <Plus className="h-4 w-4" />
      </div>
    ) : (
      <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
        <Minus className="h-4 w-4" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          My Wallet
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your VSD-lite balance and view your transaction history.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5" /> VSD-lite Balance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <Skeleton className="h-10 w-2/3" />
                    ) : (
                        <div className="flex items-center gap-2">
                             <Icons.vsd className="h-8 w-8" />
                            <p className="text-4xl font-bold">{userData?.vsdBalance || 0}</p>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">VSD-lite credits are used for platform services and can be converted to ERC-20 VSD tokens.</p>
                     <Separator />
                    <Button className="w-full" disabled>Convert to ERC-20 (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                    A complete ledger of all your VSD-lite transactions.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    </div>
                ) : transactions && transactions.length > 0 ? (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {getTransactionIcon(tx.amount)}
                                    <div>
                                        <p className="font-medium capitalize">{tx.details}</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(tx.transactionDate)}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {tx.amount > 0 ? '+' : ''}{tx.amount}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                    <p>You have no transactions yet.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
