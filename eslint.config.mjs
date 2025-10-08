// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt( {
  rules: {
    "space-in-parens"      : ["error", "always"],
    semi                   : ["error", "never"],
    "no-underscore-dangle" : ["warn"],
    "comma-dangle"         : ["error", "always-multiline"],
    "key-spacing"          : [
      "error",
      {
        align: {
          beforeColon : true,
          afterColon  : true,
          on          : "colon",
        },
      },
    ],
    "no-multi-spaces" : ["error", { exceptions: { VariableDeclarator: true } }],
    "func-names"      : ["error", "as-needed"],
    quotes            : ["error", "double"],
    camelcase         : [
      "error",
      {
        ignoreImports       : true,
        ignoreDestructuring : true,
        properties          : "never",
        allow               : ["__"],
      },
    ],

    // Vue-specific
    "vue/multi-word-component-names" : "off",
    "vue/require-explicit-emits"     : "off",
    "vue/html-self-closing"          : [
      "error",
      {
        html: {
          void      : "always",
          normal    : "never",
          component : "always",
        },
        svg  : "always",
        math : "always",
      },
    ],
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline : { max: 3 },
        multiline  : { max: 1 },
      },
    ],
    "vue/html-indent": [
      "error",
      2,
      {
        attribute                 : 1,
        baseIndent                : 1,
        closeBracket              : 0,
        alignAttributesVertically : false,
        ignores                   : [],
      },
    ],
    "vue/max-len": [
      "error",
      {
        code                      : 300,
        template                  : 300,
        tabWidth                  : 2,
        comments                  : 300,
        ignoreHTMLAttributeValues : true,
      },
    ],
  },
} )
