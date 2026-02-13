import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard,
  Calendar,
  Check,
  ArrowUp,
  Users,
  Clock,
  Zap,
  Crown,
  Star
} from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for individuals getting started',
    features: [
      'Up to 3 projects',
      'Basic time tracking',
      'Export to CSV',
      'Email support',
      'Community access'
    ],
    limitations: [
      'No team collaboration',
      'Limited analytics',
      'No API access'
    ],
    popular: false,
    current: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    period: 'per month',
    description: 'For professionals and small teams',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Team collaboration (up to 10 members)',
      'API access',
      'Priority email support',
      'Custom reports',
      'Time estimates'
    ],
    limitations: [
      'Limited to 10 team members',
      'Basic integrations'
    ],
    popular: true,
    current: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29,
    period: 'per user/month',
    description: 'For large teams and organizations',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced integrations',
      'Custom dashboards',
      'Dedicated support',
      'SLA guarantee',
      'Single sign-on (SSO)',
      'Audit logs',
      'Custom domain'
    ],
    limitations: [],
    popular: false,
    current: false
  }
];

const currentSubscription = {
  plan: 'Pro',
  status: 'active',
  startDate: '2024-01-15',
  nextBilling: '2024-02-15',
  amount: 12.00,
  billingCycle: 'monthly'
};

export const BillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // In real app, this would redirect to Stripe checkout
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Current Plan</span>
                <Badge variant="secondary">{currentSubscription.plan}</Badge>
              </CardTitle>
              <CardDescription>
                Your subscription details and billing information
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="mr-1 h-3 w-3" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Billing Cycle</div>
              <div className="font-medium capitalize">{currentSubscription.billingCycle}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Next Billing</div>
              <div className="font-medium">{currentSubscription.nextBilling}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="font-medium">${currentSubscription.amount}/month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary px-3 py-1">
                  <Star className="mr-1 h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>{plan.name}</span>
                  {plan.current && (
                    <Badge variant="outline">Current</Badge>
                  )}
                </CardTitle>
                {plan.id === 'free' ? (
                  <div className="text-3xl font-bold">Free</div>
                ) : (
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                  </div>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {plan.limitations.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Limitations</h4>
                  <ul className="space-y-1">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start text-sm text-muted-foreground">
                        <span className="mr-2">•</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full"
                    variant={plan.current ? 'outline' : plan.popular ? 'default' : 'secondary'}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upgrade to {plan.name}</DialogTitle>
                    <DialogDescription>
                      {plan.id === 'free' 
                        ? 'Downgrade to the free plan'
                        : `Upgrade to ${plan.name} plan for $${plan.price}/${plan.period}`
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Card Number</Label>
                        <Input placeholder="1234 5678 9012 3456" />
                      </div>
                      <div>
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input placeholder="123" />
                      </div>
                      <div>
                        <Label>ZIP Code</Label>
                        <Input placeholder="12345" />
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Your card will be charged ${plan.price} 
                      {plan.period === 'per month' ? ' monthly' : ''}
                      {plan.period === 'per user/month' ? ' per user monthly' : ''}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleUpgrade} disabled={isProcessing}>
                      {isProcessing ? 'Processing...' : 'Confirm Upgrade'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Your current usage this billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Team Members</span>
              </div>
              <div className="text-2xl font-bold">5/10</div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">50% of limit reached</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tracked Hours</span>
              </div>
              <div className="text-2xl font-bold">87.3h</div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">73% of monthly average</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">API Requests</span>
              </div>
              <div className="text-2xl font-bold">1,248</div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">42% of limit reached</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent billing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '1', date: '2024-01-15', description: 'Pro Plan (Monthly)', amount: '$12.00', status: 'paid' },
              { id: '2', date: '2023-12-15', description: 'Pro Plan (Monthly)', amount: '$12.00', status: 'paid' },
              { id: '3', date: '2023-11-15', description: 'Pro Plan (Monthly)', amount: '$12.00', status: 'paid' },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">{transaction.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="font-medium">{transaction.amount}</div>
                  <Badge className="bg-green-100 text-green-800">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};