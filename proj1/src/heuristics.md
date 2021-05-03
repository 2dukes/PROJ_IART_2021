# TenPair Strategy

### Eliminate Matching-Pair Sets:

Remover primeiro:
- 1 - 9
- 2 - 8
- 3 - 7
- 4 - 6
- 5 - 5

Quando não houverem mais desses, procuramos pelos restantes.

### Retain Horizontal Matches:

Começar por por eliminar os matches verticais. Possibilidade de fazer deal e deixar os horizontal matches.

### Check, Survey, Undo:
(usar o undo, não aplicável)

### Give Up:
(Limitar o número de deals)

## Specific Strategies:

### Match the Head and the Tail:

List -> Tabuleiro como uma lista, ignorando os espaços vazios
Head -> Primeiro elemento da List
Tail -> Último elemento da List

If the Head and the Tail match, and there are no other instances of that matching pair in between, then that pair is effectively eliminated. This is because when you Check, in the centre of the List will be a horizontal match of the Head-Tail pair. Eliminate it first, as appropriate, then proceed.

This is a good start to solving the classic 1 – 18 layout. Notice that you can vertically match the 1 – 1 pair at the Head, leaving 2 as the Head. This matches with the 8 at the Tail. The remaining 8 – 2 pair is separated by 9 – 1 – 1. Eliminate the middle 1 with the 1 below it, leaving the sequence 8 – 9 – 1 – 2. Then eliminate the remaining 9 – 1 horizontally. Eliminate those, and you are left with a 2 – 8 Head – Tail, effectively eliminating the 2 – 8 matching pair. (More on this later.)

Look for symmetry. If your list starts with the sequence 1 – 2, and ends with the sequence 2 – 1, then these four numbers will always be eliminable after you check.


### Seven is a Magic Number:

When starting with a 1 – 18 list, or a random list in Quick Mode, you can, upon Checking, create a vertical match if you eliminate seven numbers prior to the number you want to match vertically. Note, in most cases you will leave a number in between the vertical match (a vertical block), so be sure that vertical-blocking number can be eliminated horizontally.

This can be useful if you can leave only one of a matching set before your first check. Then, after your first check, you can quickly eliminate the matching set. Again, this makes your task exponentially easier.

Notice that this technique depends on your having an odd number of members in one of the matching-pair sets on the initial board.

### Create X – Y – X, Symmetric Sequences:

Let’s say there are only two fives on the board, and they are separated by a two. That is, the only fives on the board appear in a sequence of 5 – 2 – 5. Assuming the two is exposed, a good strategy is to keep as many twos as you can on the board, then Check. Try to ensure that the rewritten 5 – 2 – 5 sequence is eliminable via a vertical elimination of the two, then a horizontal elimination of the fives.

(Note: if the two is above the second five, in this example, then it is blocked vertically. This spoils the XYX strategy; avoid vertical blocking.)

Continue until your Check allows you to eliminate all instances of the XYX sequence.

This can get complicated. If, after checking you are unable to eliminate one of the two XYX sequences, then after the next check, you will have four XYX sequences. Avoid this.

Furthermore, X – Y – Z – Y – X is a good sequence. In this case, aim to match the Z vertically.

