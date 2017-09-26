import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.send('Home Page');
		// res.json({ version });
	});

	api.get('/process', (req, res) => {
		res.send({ status: "Processing" });
	});

	return api;
}
