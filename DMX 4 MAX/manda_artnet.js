function sendArtnet(net, subnet, universe, colorArray) {

  var net = 0x00;
  var subnet = 0x00;
  var universe = 0x00;
  var colorArray = [0xff, 0x00, 0xff, 0x00, 0xff, 0x00];

  var sequence = 0x00;
  var physical = 0x00;

  // Art-Net packet header
  var message = new Uint8Array(18 + colorArray.length);

  message[0] = 0x41; // OpCode (high byte)
  message[1] = 0x50; // OpCode (low byte)
  message[2] = 0x0e; // Protocol Version (high byte)
  message[3] = 0x00; // Protocol Version (low byte)
  message[4] = sequence; // Sequence (optional)
  message[5] = physical; // Physical (optional)
  message[6] = net; // Net
  message[7] = subnet; // Subnet
  message[8] = universe; // Universe
  message[9] = (colorArray.length >> 8) & 0xff; // Length (high byte)
  message[10] = colorArray.length & 0xff; // Length (low byte)

  // Append color values
  for (var i = 0; i < colorArray.length; i++) {
      message[11+i] = colorArray[i];
  }

  this.patcher.getnamed('sender').message(message); 
  outlet(0, message);
}

function bang() {
	var colorArray = [];
	for (i = 0; i < 512; i++) {
		colorArray.push(255);
	}
	sendArtnet(0, 0, 0, colorArray);
}

/*

var my_ip = "";
var port = 6454;
var portType = 0b01000000;
var net = 0;
var subnet = 0;
var universe = 0;
var OEM = 0x2908;
var status = 0b11010000;
var ESTA = 0;
var stateString = '#0001 [' + ('000' + this.artPollReplyCount).slice(-4) +
        '] dmxnet ArtNet-Transceiver running';

function set_ip(v) {
	my_ip = v;
}


function manda() {
	['Art-Net', 0, 0x0021,
            // 4 bytes source ip + 2 bytes port
            my_ip, port,
            // 2 bytes Firmware version, netSwitch, subSwitch, OEM-Code
            0x0001, net, subnet, oem,
            // Ubea, status1, 2 bytes ESTA
            0, status, ESTA,
            // short name (18), long name (63), stateString (63)
            this.sName.substring(0, 16), this.lName.substring(0, 63), stateString,
            // 2 bytes num ports, 4*portTypes
            1, portType, 0, 0, 0,
            // 4*goodInput, 4*goodOutput
            0b10000000, 0, 0, 0, 0, 0, 0, 0,
            // 4*SW IN, 4*SW OUT
            s.universe, 0, 0, 0, 0, 0, 0, 0,
            // 5* deprecated/spare, style
            0, 0, 0, 0x01,
            // MAC address
            parseInt(ip.mac.split(':')[0], 16),
            parseInt(ip.mac.split(':')[1], 16),
            parseInt(ip.mac.split(':')[2], 16),
            parseInt(ip.mac.split(':')[3], 16),
            parseInt(ip.mac.split(':')[4], 16),
            parseInt(ip.mac.split(':')[5], 16),
            // BindIP
            sourceip.split('.')[0], sourceip.split('.')[1],
            sourceip.split('.')[2], sourceip.split('.')[3],
            // BindIndex, Status2
            bindIndex, 0b00001110,
          ]));
	outlet(0, 'A'+'r'+'t'+'–'+'N'+'e'+'t'+0x00);
	
	var buffer = new Buffer(18 + (colorArray.length * 3));
	outlet(0, )
}
*/