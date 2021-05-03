/* Move class which specifies a (valid) move. 
   p1 - Initial position
   p2 - Final position
   startNumber - Initial position number
   endNumber - Final position number
*/
class Move {
    constructor(p1, p2, startNumber, endNumber) {
        this.p1 = p1;
        this.p2 = p2;

        this.startNumber = startNumber;
        this.endNumber = endNumber;
    }

    equals(m2) { // moves with same pair of cells (no matter the order)
        if((this.p1 == m2.p1 && this.p2 == m2.p2) || (this.p2 = m2.p1 && this.p1 == m2.p2)) 
            return true; 

        return false;
    }
}

