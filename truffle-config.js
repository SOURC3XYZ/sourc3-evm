const ganache = require('ganache');

const options = {
    logging: {
        quiet: true
    }    
};
const server = ganache.server(options);
const PORT = 8545;
server.listen(PORT, async err => {
});

require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
    /**
     * Networks define how you connect to your ethereum client and let you set the
     * defaults web3 uses to send transactions. If you don't specify one truffle
     * will spin up a development blockchain for you on port 9545 when you
     * run `develop` or `test`. You can ask a truffle command to use a specific
     * network from the command line, e.g
     *
     * $ truffle test --network <network-name>
     */

    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*',
        },
        local: {
            provider: () => new HDWalletProvider(process.env.MNEMONIC, 'http://localhost:8543/', 0, 6),
            network_id: '*'
        },
        mumbai: {
            provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://matic-mumbai.chainstacklabs.com', 0, 6),
            network_id: '80001'
        }
    },

    // Set default mocha options here, use special reporters, etc.
    mocha: {
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: "0.8.14",      // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            settings: {          // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: "byzantium"
            }
        }
    },
};
