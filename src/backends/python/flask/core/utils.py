def format_model(model, excluded_keys=['id', 'uuid']):
    return { k: v for k, v in model.items() if k not in excluded_keys }