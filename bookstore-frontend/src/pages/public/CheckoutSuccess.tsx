import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutSuccess() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-24 w-24 text-success" />
        </div>
        <h1 className="text-4xl font-serif font-bold">Order Confirmed!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>
        <div className="pt-8">
          <Link to="/shop">
            <Button size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
