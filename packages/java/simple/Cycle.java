package simple;

class Cycle {
    
    int speed = 0;
    int gear = 1;
    int cadence = 0;

    public Cycle(){
        System.out.println('Cycle created');
    }
    public final void changeCadence(int newValue){
        this.cadence = newValue;
    }
}