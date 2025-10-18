
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signupAction } from "@/app/actions/user";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirebase, initiateEmailSignIn, useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useWeb3Store } from "@/store/web3-store";

const initialState = {
  message: null,
  user: null,
  errors: {},
};

function AuthSubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : (isLogin ? "Login to Your Studio" : "Create Your Free Account")}
    </Button>
  );
}

export default function AuthForm() {
  const [signupState, signupFormAction] = useActionState(signupAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { isWeb3Enabled } = useWeb3Store();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (signupState.message) {
      toast({
        title: signupState.errors ? "Error" : "Success",
        description: signupState.message,
        variant: signupState.errors ? "destructive" : "default",
      });
      if (signupState.user && auth?.currentUser) {
        // After successful sign-up, force a token refresh to get custom claims
        auth.currentUser.getIdToken(true).then(() => {
           // Firebase onAuthStateChanged will trigger with the new user object (and claims)
           // and the previous useEffect will handle the redirect.
        });
      }
    }
  }, [signupState, toast, auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoggingIn(true);
    // initiateEmailSignIn is non-blocking. onAuthStateChanged listener handles the rest.
    initiateEmailSignIn(auth, email, password);
    // Let's add a small timeout to handle cases where login fails silently
    // before onAuthStateChanged gets a chance to react.
    setTimeout(() => {
        if(!auth.currentUser) {
            setIsLoggingIn(false);
            toast({
                title: "Login Failed",
                description: "Please check your email and password.",
                variant: "destructive"
            })
        }
    }, 2000);
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google Login Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const handleWalletLogin = () => {
    // Only check for wallet if the feature is enabled by the user
    if (!isWeb3Enabled) {
       toast({
        title: "Web3 Disabled",
        description: "Please enable Web3 integration in your settings to connect a wallet.",
      });
      return;
    }

    if (typeof (window as any).ethereum === 'undefined') {
      toast({
        duration: 8000,
        title: "No Web3 Wallet Detected",
        description: (
            <div className="flex flex-col gap-2 text-sm">
                <p>To use Web3 features, please install a wallet like MetaMask.</p>
                <p className="font-semibold">You will not be able to:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                    <li>Trade music rights on the Audio Exchange.</li>
                    <li>Convert VSD-lite to ERC-20 VSD tokens.</li>
                    <li>Buy, sell, or trade Album NFTs.</li>
                </ul>
            </div>
        )
      });
    } else {
      toast({
        title: "Coming Soon!",
        description: "Web3 wallet login is under development.",
        variant: "default"
      });
      // In the future, you would initiate the wallet connection here, e.g.:
      // (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }
  };


  return (
    <Card className="mx-auto max-w-sm w-full bg-card/80 backdrop-blur-lg">
      <CardHeader className="text-center">
        <div className="mx-auto h-32 w-32 sm:h-40 sm:w-40 relative">
            <Icons.logo />
        </div>
        <CardTitle className="font-headline text-xl sm:text-2xl font-bold">
          VNDR Music
        </CardTitle>
        <CardDescription className="text-sm">
          The Autonomous Music Publishing Ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn || isUserLoading}>
                {isLoggingIn || isUserLoading ? <Loader2 className="animate-spin" /> : "Login to Your Studio"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form action={signupFormAction} className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
                 {signupState.errors?.email && <p className="text-sm text-destructive">{signupState.errors.email[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" name="password" type="password" required />
                {signupState.errors?.password && <p className="text-sm text-destructive">{signupState.errors.password[0]}</p>}
              </div>
               {signupState.errors?._form && <p className="text-sm text-destructive">{signupState.errors._form[0]}</p>}
              <AuthSubmitButton isLogin={false} />
            </form>
          </TabsContent>
        </Tabs>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isGoogleLoading || isUserLoading}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177 56.5L357 150c-24.3-23.4-58.3-37-99-37-73 0-132.3 59.3-132.3 132.3s59.3 132.3 132.3 132.3c76.5 0 119.5-52.2 123.3-78.2h-123.3v-63h240.2c2.4 12.6 3.8 26.3 3.8 40.8z"></path></svg>}
                Google
            </Button>
            <Button variant="outline" className="w-full" onClick={handleWalletLogin}>
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="wallet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M461.2 128.4L282.8 12.8c-12.6-9.1-29-9.1-41.6 0L28.8 128.4c-12.6 9.1-12.6 29 0 38.2L124 224v176c0 13.3 10.7 24 24 24h192c13.3 0 24-10.7 24-24V224l95.2-57.4c12.6-9.1 12.6-29 0-38.2zM256 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"></path></svg>}
                Wallet
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
