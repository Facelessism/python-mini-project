print("=" * 50)
print("FLAMES GAME")
print("=" * 50)
print("\nF - Friends")
print("L - Love")
print("A - Affection")
print("M - Marriage")
print("E - Enemies")
print("S - Siblings")
print("=" * 50)

name1 = input("\nEnter first name: ").lower().replace(" ", "")
name2 = input("Enter second name: ").lower().replace(" ", "")

if not name1 or not name2:
    print("\nError: Names cannot be empty!")
else:
    original_name1 = name1
    original_name2 = name2
    
    name1_list = list(name1)
    name2_list = list(name2)
    
    for char in name1_list[:]:
        if char in name2_list:
            name1_list.remove(char)
            name2_list.remove(char)
    
    count = len(name1_list) + len(name2_list)

    total_len = len(original_name1) + len(original_name2)
    matched_chars = total_len - count
    love_score = 30 + round((matched_chars / total_len) * 70) if total_len > 0 else 0
    
    print(f"\nAfter removing common letters:")
    print(f"Remaining letters: {count}")
    
    flames = ['F', 'L', 'A', 'M', 'E', 'S']
    
    index = 0
    while len(flames) > 1:
        index = (index + count - 1) % len(flames)
        removed = flames.pop(index)
        if index == len(flames) and len(flames) > 0:
            index = 0
    
    result = flames[0]
    
    print("\n" + "=" * 50)
    print("RESULT")
    print("=" * 50)
    
    if result == 'F':
        relationship = "Friends"
        emoji = "🤝"
    elif result == 'L':
        relationship = "Love"
        emoji = "❤️"
    elif result == 'A':
        relationship = "Affection"
        emoji = "😊"
    elif result == 'M':
        relationship = "Marriage"
        emoji = "💍"
    elif result == 'E':
        relationship = "Enemies"
        emoji = "😈"
    else:
        relationship = "Siblings"
        emoji = "🏠"
    
    
    print(f"\n{original_name1.capitalize()} & {original_name2.capitalize()}")
    print(f"💖 {relationship} {emoji} 💖")
    print(f"Match Score: {love_score}%") # Added score display
    print("\n" + "=" * 50)

    share_text = f"🔥 FLAMES Result: {original_name1.capitalize()} + {original_name2.capitalize()} = {relationship} {emoji} ({love_score}% Match!)"
    print("COPY TO SHARE:")
    print(share_text)
    print("=" * 50)
