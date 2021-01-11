module.exports = {
    purge: [],
    theme: {
        extend: {},
        borderRadius: {
            "none": "0",
            "xl": "1rem",
            "2xl": "2rem",
            "full": "999999px"
        },
        maxHeight: {
            "0": "0",
            "1/4": "25%",
            "1/2": "50%",
            "3/4": "75%",
            "full": "100%",
            "1/2-screen": "50vh"
        }
    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
        }
    },
    plugins: [],
}
