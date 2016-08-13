/*
This boilerplate is under construction. Watch this space.
*/
var map = new mapboxgl.Map({
	container: 'chart',
	center: [-96.9785, 32.8924],
	zoom: 9,
	hash: true,
	style: 'styles.json'
});

map.addControl(new mapboxgl.Navigation());