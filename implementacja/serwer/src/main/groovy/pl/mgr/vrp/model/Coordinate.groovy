package pl.mgr.vrp.model

class Coordinate {
    double x, y

    void setX(double value){
        this.x = value
    }

    void setX(String value){
        this.x = Double.valueOf(value)
    }


    void setY(double value){
        this.y = value
    }

    void setY(String value){
        this.y = Double.valueOf(value)
    }
}
