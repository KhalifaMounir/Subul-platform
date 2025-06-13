def format_response(data, status=200):
    return {"data": data, "status": status}, status