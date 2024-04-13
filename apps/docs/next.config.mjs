import createBundleAnalyzer from '@next/bundle-analyzer';
import createMDX from 'fumadocs-mdx/config';
import {
  remarkDynamicContent,
  remarkInstall,
  rehypeCodeDefaultOptions,
  remarkDocGen,
} from 'fumadocs-core/mdx-plugins';
import { transformerTwoslash } from 'fumadocs-twoslash';
import rehypeKatex from 'rehype-katex';
import { typescriptGen } from 'fumadocs-typescript';
import remarkMath from 'remark-math';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: {
    // Replaced by root workspace command
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.noParse = [/typescript\/lib\/typescript.js/];

    return config;
  },
};

const withMDX = createMDX({
  buildSearchIndex: {
    filter: (v) => {
      return !v.match(/.+\.model\.mdx/);
    },
  },
  mdxOptions: {
    rehypeCodeOptions: {
      transformers: [
        ...rehypeCodeDefaultOptions.transformers,
        transformerTwoslash(),
        {
          name: 'fumadocs:remove-escape',
          code(element) {
            element.children.forEach((line) => {
              if (line.type !== 'element') return;

              line.children.forEach((child) => {
                if (child.type !== 'element') return;
                const textNode = child.children[0];
                if (!textNode || textNode.type !== 'text') return;

                textNode.value = textNode.value.replace(/\[\\!code/g, '[!code');
              });
            });

            return element;
          },
        },
      ],
    },
    lastModifiedTime: 'git',
    remarkPlugins: [
      remarkMath,
      remarkDynamicContent,
      [remarkInstall, { Tabs: 'InstallTabs' }],
      [remarkDocGen, { generators: [typescriptGen()] }],
    ],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});

export default withAnalyzer(withMDX(config));
