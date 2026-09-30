import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full border-border/50 shadow-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-serif">Reset Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <p className="text-sm text-center text-muted-foreground">Forgot Password form placeholder...</p>
             <Link to="/login" className="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition hover:bg-primary/90">Back to Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
