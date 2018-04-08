package pl.mgr.vrp.model

import groovy.transform.AutoClone

@AutoClone
class VRPRoute {

    List<VRPCustomer> points = []
    List<VRPDrivePoint> drivePoints = []
    String color

    double routeLength = 0
    static hasMany = [points: VRPCustomer, drivePoints: VRPDrivePoint]
    static belongsTo = [solution: VRPSolution]

    static constraints = {
        color nullable: true
    }

}
