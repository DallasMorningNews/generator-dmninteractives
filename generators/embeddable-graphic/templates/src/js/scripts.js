import $ from 'jquery';
import pym from 'pym.js';

const pymChild = new pym.Child();

// Your graphic code goes here
//
// |
// +   +--+        +--+
// |   |  +---+    |  |
// |   |  ||  |    |  |
// +   |  ||  +----+  |
// |   |  ||  ||  ||  |
// |   |  ||  ||  ||  |
// +   |  ||  ||  ||  |
// |   |  ||  ||  ||  |
// |   |  ||  ||  ||  |
// +-------------------------+

// Call this every time you need to resize the iframe, after your
// graphic is drawn, etc.
pymChild.sendHeight();
