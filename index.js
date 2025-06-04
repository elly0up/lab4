function filterIn(field, values) {
    return {
        type: 'filterIn',
        field,
        values: Array.isArray(values) ? values.slice() : []
    };
}

function select(...fields) {
    return {
        type: 'select',
        fields: fields.slice()
    };
}

function query(collection, ...operations) {
    const items = collection.map(item => Object.assign({}, item));

    if (operations.length === 0) {
        return items;
    }

    const filterCriteria = {};
    operations.forEach(op => {
        if (op.type === 'filterIn') {
            const field = op.field;
            const vals = op.values;
            if (!filterCriteria.hasOwnProperty(field)) {
                filterCriteria[field] = vals.slice();
            } else {
                const prev = filterCriteria[field];
                filterCriteria[field] = prev.filter(x => vals.includes(x));
            }
        }
    });

    let filtered = items.filter(item => {
        for (const field in filterCriteria) {
            if (!item.hasOwnProperty(field) || !filterCriteria[field].includes(item[field])) {
                return false;
            }
        }
        return true;
    });

    const selectOps = operations.filter(op => op.type === 'select');
    let fieldsToKeep = null;

    if (selectOps.length > 0) {
        fieldsToKeep = new Set(selectOps[0].fields);
        for (let i = 1; i < selectOps.length; i++) {
            const nextFields = new Set(selectOps[i].fields);
            fieldsToKeep = new Set([...fieldsToKeep].filter(f => nextFields.has(f)));
        }
    }

    if (fieldsToKeep !== null) {
        filtered = filtered.map(item => {
            const projected = {};
            for (const field of fieldsToKeep) {
                if (item.hasOwnProperty(field)) {
                    projected[field] = item[field];
                }
            }
            return projected;
        });
    }

    return filtered;
}

module.exports = {
    query,
    select,
    filterIn
};
