Rules engine based on map table approach
========================================

It allows you to setup simple rules set based on the table design. This in turn allows you
to use spreadsheets as a configuration tool.

### Example:

```javascript
var MapTable = require('map-table');

var map = new MapTable([
  ['id', 'x', 'y'],
  ['1' , '1', 'a'],
  ['2' , '2', 'b']
  ['3' , '2', null]
]);

console.log(map.match({ x: '1', y: 'a' }).id); // outputs '1'
console.log(map.match({ x: '2', y: 'xyz' })); // outputs '3'
```
