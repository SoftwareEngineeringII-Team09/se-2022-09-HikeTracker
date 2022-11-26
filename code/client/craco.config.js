const path = require("path")
const { CracoAliasPlugin } = require('react-app-alias')

const options = {}

module.exports = {
    plugins: [
        {
            plugin: CracoAliasPlugin,
            options: {}
        }
    ],
    webpack: {
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@contexts': path.resolve(__dirname, 'src/contexts'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@layouts': path.resolve(__dirname, 'src/layouts'),
            '@lib': path.resolve(__dirname, 'src/lib'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@services': path.resolve(__dirname, 'src/services'),
        }
    },
    jest: {
        babel: {
            addPresets: true,
            addPlugins: true,
        },
        configure: (jestConfig, { env, paths, resolve, rootDir }) => {
            return jestConfig;
        },
    }
}