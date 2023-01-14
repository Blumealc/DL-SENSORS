inlets = 1; 
outlets = 1;

function bang(){
	// Run garbage collection to clear out any old object listeners
	// before registering new ones.
	gc();

	// Global parameter listeners
	new ParameterListener('live.dial', dialCb);
}

function msg_int(){
	dialCb();
}

// Parses SysEx message
function list(){
	post('list');
}

/**
 * Parameter listeners
 */
function dialCb(data){

    //var midiBuf = Array.apply(null, Array(12)).map(Number.prototype.valueOf,0);
    var midiBuf = [];

    midiBuf[0]  = 0xF0; // Start
    midiBuf[1]  = 0x00;
    midiBuf[2]  = 0x21;
    midiBuf[3]  = 0x72;
    midiBuf[4]  = 1;
    midiBuf[5] 	= 0;
    midiBuf[6] 	= 0;
    midiBuf[7] 	= 0;
    midiBuf[8] 	= 0;
    midiBuf[9] 	= 0;
    midiBuf[10] = 8; // Discover
    midiBuf[11] = 0xF7; // Stop
	
	outlet(0, midiBuf);
}
dialCb.local = 1;
