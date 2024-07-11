module.exports = {
    root: true,
    extends: 'torchbox/typescript',
    rules: {
        'react/prop-types': 'off',
        'jsx-a11y/label-has-associated-control': [
            2,
            {
                controlComponents: ['Toggle'],
                depth: 3,
            },
        ],
    },
};
