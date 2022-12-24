import express from 'express';
import axios from 'axios';
import { log } from '../common/classes/log.class';

import { config } from '../common/config/config';

const router = express.Router();
const bodyParser = require('body-parser');

/** Route for testing payment gateway. Will be removed soon */
router.get('/api/v1/converge_token_req', async (req: express.Request, res: express.Response) => {
    const transactionTokenUrl = 'https://api.demo.convergepay.com/hosted-payments/transaction_token'
    let body = {
        ssl_merchant_id: config.converge.ssl_merchant_id,
        ssl_user_id: config.converge.ssl_user_id,
        ssl_pin: config.converge.ssl_pin,
        ssl_vendor_id: 'reframe1',
        tenant_id: '1234',
        ssl_transaction_type: 'ccaddrecurring',
        ssl_amount: '1.00',
        ssl_billing_cycle: 'DAILY',
        ssl_next_payment_date: '12/19/2022',
        ssl_end_of_month: 'Y',
    }

    await axios.post(transactionTokenUrl, body, {
        headers: { 
            'Content-Type' : 'application/x-www-form-urlencoded' 
        }
        })
        .then(function (response:any) {
            log.info("#### Inside token API successful response");
            const token = encodeURIComponent(response.data);
            res.writeHead(301, {
                Location: `https://api.demo.convergepay.com/hosted-payments?ssl_txn_auth_token=${token}`
              }).end();
        })
        .catch(function (error:any) {
            log.error('there was an error getting transaction token: ', error);
            res.json({error: error});
    });
    
});

router.post('/api/v1/payment_success', bodyParser.urlencoded({ extended: true }),
    async (req: express.Request, res: express.Response) => {
    log.info("Converge request body", req.body);
    res.json({body: req.body});
    //populate the DB
    //redirect to dashboard URL in FE
});
export { router as PaymentGatewayRouter };
