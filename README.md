# HouseHelp Manager

HouseHelp Manager is a React Native application designed to help users manage and track the attendance and salary of house helps. The app provides features to add, edit, and view house help details, mark attendance, and calculate salaries based on attendance records.

## Features

- **Add and Edit House Helps**: Easily add new house helps and edit existing ones with details like name, monthly salary, and number of shifts.
- **Attendance Tracking**: Mark attendance for each house help on a daily basis, with options for full day, half day, or absent.
- **Salary Calculation**: Automatically calculate salaries based on attendance records, considering full and half days.
- **Calendar View**: View attendance records in a calendar format to easily track attendance over time.
- **Theming**: The app adapts to the system's light or dark theme for a consistent user experience.

## Tech Stack

- **React Native**: For building the mobile application.
- **Expo**: For development and testing.
- **SQLite**: For local data storage.
- **TypeScript**: For type-safe code.
- Cursor Composer: For writing code. 

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Piyushhbhutoria/househelp-manager.git
   cd househelp-manager
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install Expo CLI** (if not already installed):

   ```bash
   npm install -g expo-cli
   ```

4. **Start the Expo server**:

   ```bash
   npx expo start
   ```

5. **Run on iOS Simulator**:
   - Press `i` in the terminal to open the iOS simulator.

6. **Run on Android Emulator**:
   - Press `a` in the terminal to open the Android emulator.

7. **Run on a physical device**:
   - Install the Expo Go app from the App Store or Google Play.
   - Scan the QR code displayed in the terminal or Expo Dev Tools.

## Building for iOS

1. **Ensure you have Xcode installed** on your Mac.

2. **Run the iOS build**:

   ```bash
   npx expo run:ios
   ```

3. **Troubleshooting CocoaPods issues**:
   - If you encounter issues with CocoaPods, try running:

     ```bash
     cd ios
     pod install
     cd ..
     ```

## Building for Android

1. **Ensure you have Android Studio installed**.

2. **Run the Android build**:

   ```bash
   npx expo run:android
   ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
