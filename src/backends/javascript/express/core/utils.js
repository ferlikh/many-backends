class Utils {
    static formatModel(model, exclude_columns=['id', 'uuid']) {
        return Object.fromEntries(
            Object.entries(model).filter(([key]) => !exclude_columns.includes(key))
        );
    }
}

module.exports = Utils;