// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Bot } from "lucide-react";
// import { usePlayerGameContext } from "@/contexts/PlayerGameContext/usePlayerGameContext";
// import { useNavigation } from "@/hooks/useNavigation";

// export default function ConfigureBotGame() {
//   const { navigateToGameplay } = useNavigation();
//   const { state, setPlayerName, setBotDifficulty, startBotGame } =
//     usePlayerGameContext();

//   const handleStartBotGame = () => {
//     if (!state.playerName.trim()) {
//       alert("Please enter your name");
//       return;
//     }

//     startBotGame(state.playerName, state.botDifficulty);
//     navigateToGameplay();
//   };

//   return (
//     <div className="container mx-auto py-8">
//       <div className="max-w-2xl mx-auto">
//         <Card>
//           <CardHeader>
//             <CardTitle>
//               <div className="flex items-center gap-2">
//                 <Bot className="w-5 h-5" />
//                 Configure Bot Game
//               </div>
//             </CardTitle>
//             <CardDescription>
//               Set up your game against a bot opponent. Game starts from 501
//               points and counts down to 0.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">Play vs Bot</h3>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Enter your name and choose bot difficulty level.
//                 </p>
//               </div>

//               <div>
//                 <Label htmlFor="player-name">Your Name</Label>
//                 <Input
//                   id="player-name"
//                   placeholder="Enter your name"
//                   value={state.playerName}
//                   onChange={(e) => setPlayerName(e.target.value)}
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label>Bot Difficulty</Label>
//                 <div className="space-y-2 mt-2">
//                   {(["easy", "medium", "hard"] as const).map((level) => (
//                     <label
//                       key={level}
//                       className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted"
//                     >
//                       <input
//                         type="radio"
//                         name="difficulty"
//                         value={level}
//                         checked={state.botDifficulty === level}
//                         onChange={(e) =>
//                           setBotDifficulty(
//                             e.target.value as "easy" | "medium" | "hard"
//                           )
//                         }
//                         className="w-4 h-4"
//                       />
//                       <span className="capitalize font-medium">{level}</span>
//                       <span className="text-sm text-muted-foreground">
//                         {level === "easy" && "Bot makes occasional mistakes"}
//                         {level === "medium" && "Balanced bot opponent"}
//                         {level === "hard" && "Challenging bot opponent"}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <Button className="w-full" onClick={handleStartBotGame}>
//               Start Game vs Bot
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Game Rules Info */}
//         <Card className="mt-6">
//           <CardHeader>
//             <CardTitle className="text-base">Game Rules</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2 text-sm text-muted-foreground">
//             <p>
//               • The game starts with each player having{" "}
//               <strong>501 points</strong>
//             </p>
//             <p>• Players take turns throwing darts and deducting their score</p>
//             <p>
//               • The first player to reach exactly <strong>0</strong> wins
//             </p>
//             <p>
//               • If a player's score goes below 0, their turn is "busted" and the
//               score is restored
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
