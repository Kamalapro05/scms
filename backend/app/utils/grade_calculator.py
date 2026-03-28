def calculate_grade(percentage: float) -> str:
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B+"
    elif percentage >= 60:
        return "B"
    elif percentage >= 50:
        return "C"
    elif percentage >= 40:
        return "D"
    else:
        return "F"


def calculate_percentage(obtained: float, total: float) -> float:
    if total == 0:
        return 0.0
    return round((obtained / total) * 100, 2)
