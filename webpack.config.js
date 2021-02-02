const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    const isProd = !!env.production;
    const isDev = !!env.development;

    const getStyleLoaders = () => {
        return [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
        ];
    };

    const getPlugins = () => {
        const plugins = [
            new HtmlWebpackPlugin({
                template: "public/index.html",
            }),
            new ESLintWebpackPlugin({
                extensions: ["js", "jsx", "ts", "tsx"],
            }),
        ];

        isProd &&
            plugins.push(
                new MiniCssExtractPlugin({
                    filename: "main-[hash:8].css",
                })
            );

        return plugins;
    };

    return {
        mode: isProd ? "production" : isDev ? "development" : "none",

        entry: "./src/index.ts",

        output: {
            publicPath: "/",
            filename: isProd ? "main-[hash:8].js" : undefined,
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
        },

        module: {
            rules: [
                //Loading ts
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: "ts-loader",
                },

                //Loading images
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "images",
                                name: "[name]-[sha1:hash:7].[ext]",
                            },
                        },
                    ],
                },

                //Loading svg

                {
                    test: /\.svg$/,
                    use: "svg-inline-loader",
                },

                //Loading fonts
                {
                    test: /\.(ttf|woff|woff2|eot|otf)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "fonts",
                                name: "[name].[ext]",
                            },
                        },
                    ],
                },

                //Loading css
                {
                    test: /\.css$/,
                    use: getStyleLoaders(),
                },

                //Loading scss
                {
                    test: /\.s[ac]ss$/,
                    use: [...getStyleLoaders(), "sass-loader"],
                },
            ],
        },

        plugins: getPlugins(),

        devServer: {
            open: true,
            historyApiFallback: true,
        },

        devtool: isDev && "source-map",
    };
};
