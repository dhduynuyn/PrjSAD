from BUS.userBUS import UserBUS

def main():
    bus = UserBUS()

    while True:
        print("\n1. Login\n2. Signup\n3. Exit")
        choice = input("Choose an option: ")

        if choice == "1":
            username = input("Enter username: ")
            password = input("Enter password: ")

            user = bus.login(username, password)
            if user:
                print(f"Welcome, {user.full_name}")
            else:
                print("Invalid login credentials.")

        elif choice == "2":
            username = input("Choose a username: ")
            password = input("Choose a password: ")
            full_name = input("Enter your full name: ")

            if bus.signup(username, password, full_name):
                print("Signup successful! You can now log in.")
            else:
                print("Signup failed. Username may already be taken.")

        elif choice == "3":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
