import { expect, it } from 'vitest';
import { DEFAULT_SAVE } from '../../../src/games/royal-palace-blackjack/storage';
import { blackjackSaveDefinition, durableCheckpoint, restorePracticeCredits } from '../../../src/games/royal-palace-blackjack/persistence';
import { threefoldSaveDefinition } from '../../../src/games/threefold/persistence';
it('does not commit chip construction, deal, split/double/insurance or an unfinished round',()=>{
 const committed=structuredClone(DEFAULT_SAVE);
 const visible={...committed,bankroll:700,lastBet:100,sessionNet:-50,preferences:{sound:true,hints:false}};
 for(const phase of ['betting','player','dealer'] as const) expect(durableCheckpoint(committed,visible,phase)).toEqual({...committed,preferences:visible.preferences});
 expect(durableCheckpoint(committed,visible,'settled')).toEqual(visible);
});
it('projects only durable fields and rejects invalid persisted game state',()=>{
 const state=blackjackSaveDefinition.decode({...DEFAULT_SAVE,shoe:['A'],currentBet:100});expect(state).toEqual(DEFAULT_SAVE);expect(state).not.toHaveProperty('shoe');
 expect(blackjackSaveDefinition.decode({...DEFAULT_SAVE,bankroll:NaN})).toBeNull();
 expect(blackjackSaveDefinition.decode({...DEFAULT_SAVE,stats:{wins:1.5,losses:0,pushes:0}})).toBeNull();
 expect(blackjackSaveDefinition.decode({...DEFAULT_SAVE,preferences:{sound:'yes',hints:false}})).toBeNull();
 expect(threefoldSaveDefinition.decode({bestScore:500,activeRun:{}})).toEqual({bestScore:500});
 for(const value of [-1,80,501,NaN,Infinity])expect(threefoldSaveDefinition.decode({bestScore:value})).toBeNull();
});


it('restores only the Blackjack practice bankroll when credits fall below the table minimum',()=>{
 const prior={...DEFAULT_SAVE,bankroll:2.5,lastBet:25,stats:{wins:9,losses:8,pushes:2},sessionNet:-997.5,preferences:{sound:true,hints:true}};
 expect(restorePracticeCredits(prior)).toEqual({...prior,bankroll:1000});
 expect(restorePracticeCredits({...prior,bankroll:5})).toBeNull();
});
