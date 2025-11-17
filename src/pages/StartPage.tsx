import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigation } from '@/hooks/useNavigation';

export default function StartPage() {
  const { navigateToConfigureGame, navigateToSignIn, navigateToRegister } =
    useNavigation();

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-primary/5 to-background">
      <div className="w-full overflow-hidden bg-linear-to-b from-primary/20 to-primary/5 py-6 px-4 sm:py-10">
        <div className="mx-auto max-w-md">
          <Card className="overflow-hidden shadow-xl border-0">
            <div className="relative w-full overflow-hidden rounded-lg bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center min-h-64 sm:min-h-72">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1149/1149833.png"
                alt="Dart icon"
                className="h-48 w-48 object-contain sm:h-56 sm:w-56"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-0 left-4 right-4 text-center">
                <Badge className="bg-primary text-primary-foreground font-semibold text-xs px-3 py-1 inline-block">
                  🎯 Dart Game
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to Dart
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:mt-4">
              Test your throwing skills and challenge yourself in an exciting
              dart game experience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card className="p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 font-normal text-xs mt-0.5">
                  ⚡
                </Badge>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Fast Paced
                  </p>
                  <p className="text-xs text-muted-foreground">Quick rounds</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 font-normal text-xs mt-0.5">
                  🏆
                </Badge>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Competitive
                  </p>
                  <p className="text-xs text-muted-foreground">Beat scores</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-400 font-normal text-xs mt-0.5">
                  🎮
                </Badge>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Engaging
                  </p>
                  <p className="text-xs text-muted-foreground">Fun gameplay</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-400 font-normal text-xs mt-0.5">
                  📊
                </Badge>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Trackable
                  </p>
                  <p className="text-xs text-muted-foreground">Your stats</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Start Game Button */}
          <div className="mb-6">
            <Button
              onClick={navigateToConfigureGame}
              size="lg"
              className="w-full text-base font-semibold h-12 sm:h-11"
            >
              Start Playing
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-base font-semibold h-12 sm:h-11"
              onClick={navigateToSignIn}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8a4 4 0 014-4h10a4 4 0 014 4v8a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"
                />
              </svg>
              Sign In
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full text-base font-semibold h-12 sm:h-11"
              onClick={navigateToRegister}
            >
              Create Account
            </Button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
