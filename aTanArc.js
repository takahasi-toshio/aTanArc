onload = function() {
    aTanArc();
}

function aTanArc()
{
    var prevPoint = new Point( 413.0, 24.0 );
    var point = new Point( 150.0, 200.0 );
    var nextPoint = new Point( 413.0, 435.0 );

    var radius = 200.0;

    var arc = getATanArc( prevPoint, point, nextPoint, radius );

    var canvas = document.getElementById( "canvas" );
    var context = canvas.getContext( "2d" );

    context.beginPath();
    context.moveTo( prevPoint.getX(), prevPoint.getY() );
    if( arc ) {
        context.arc( arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle, arc.anticlockwise );
    }
    else {
        context.lineTo( point.getX(), point.getY() );
    }
    context.lineTo( nextPoint.getX(), nextPoint.getY() );
    context.stroke();
}

function Point( x, y )
{
    this.x = x;
    this.y = y;
}

Point.prototype.getX = function() {
    return this.x;
}

Point.prototype.getY = function() {
    return this.y;
}

Point.prototype.getLength = function() {
    return Math.sqrt( this.x * this.x + this.y * this.y );
}

Point.prototype.getRadian = function() {
    return Math.atan2( this.y, this.x );
}

function Arc()
{
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.startAngle = 0;
    this.endAngle = 0;
    this.anticlockwise = false;
}

function getATanArc( prevPoint, point, nextPoint, radius )
{
    var vec1 = new Point( nextPoint.getX() - point.getX(), nextPoint.getY() - point.getY() );
    var vec2 = new Point( prevPoint.getX() - point.getX(), prevPoint.getY() - point.getY() );

    var crossProduct = vec1.getX() * vec2.getY() - vec1.getY() * vec2.getX();
    if( crossProduct == 0 ) {
        return null;
    }

    var vec1_len = vec1.getLength();
    if( vec1_len == 0 ) {
        return null;
    }

    var vec2_len = vec2.getLength();
    if( vec2_len == 0 ) {
        return null;
    }

    var innerProduct = vec1.getX() * vec2.getX() + vec1.getY() * vec2.getY();
    var cos_theta = innerProduct / vec1_len / vec2_len;
    var theta = Math.acos( cos_theta );
    var len = radius / Math.tan( theta / 2 );
    if( ( len > vec1_len ) || ( len > vec2_len ) ) {
        return null;
    }

    var startPoint = new Point( point.getX() + vec2.getX() / vec2_len * len, point.getY() + vec2.getY() / vec2_len * len );
    var endPoint = new Point( point.getX() + vec1.getX() / vec1_len * len, point.getY() + vec1.getY() / vec1_len * len );
    if( crossProduct < 0 ) {
        var centerPoint = new Point( startPoint.getX() - vec2.getY() / vec2_len * radius, startPoint.getY() + vec2.getX() / vec2_len * radius );
    }
    else {
        var centerPoint = new Point( startPoint.getX() + vec2.getY() / vec2_len * radius, startPoint.getY() - vec2.getX() / vec2_len * radius );
    }

    var arc = new Arc;
    arc.startAngle = ( new Point( startPoint.getX() - centerPoint.getX(), startPoint.getY() - centerPoint.getY() ) ).getRadian();
    arc.endAngle = ( new Point( endPoint.getX() - centerPoint.getX(), endPoint.getY() - centerPoint.getY() ) ).getRadian();
    arc.radius = radius;
    arc.x = centerPoint.getX();
    arc.y = centerPoint.getY();
    arc.anticlockwise = ( crossProduct < 0 ) ? true : false;
    return arc;
}
