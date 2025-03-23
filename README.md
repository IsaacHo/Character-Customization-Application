# Character Customization

[中文版本](README-zh-CN.md)

## Character Customization Application

This is a character customization application based on Vue.js and Three.js, use .cursorrules and cost 2 hour setup base, allowing users to customize character facial features, hairstyles, and accessories. Users can save and load character settings using IndexedDB for data storage.

### Features Overview

- **Facial Customization**: Users can adjust the size of the character's nose, eyes, and mouth.
- **Hairstyle Customization**: Options for short, long, and curly hair, with adjustments for volume, length, and curliness.
- **Accessory Customization**: Users can choose earrings, hair accessories, and necklaces, adjusting their size and position.
- **Save and Load**: Users can save character settings to local IndexedDB and load saved characters.

### Tech Stack

- **Frontend**: Vue.js, Three.js, Vite, GSAP
- **Data Storage**: IndexedDB

### Installation and Running

1. **Clone the Project**

   ```bash
   git clone https://github.com/your-repo/character-customization.git
   cd character-customization
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Development**

   ```bash
   npm run dev
   ```

4. **Open in Browser**

   Open your browser and navigate to `http://localhost:8080`.

### Usage Instructions

1. **Character Customization Interface**: 
   - At the top of the page, users can see the title and tabs for character customization.
   - The tabs include "Face", "Hairstyle", and "Accessories".

2. **Facial Customization**:
   - In the "Face" tab, users can use sliders to adjust the size of the nose, eyes, and mouth.
   - Users can select preset facial features.

3. **Hairstyle Customization**:
   - In the "Hairstyle" tab, users can choose different hairstyles (short, long, curly).
   - Users can adjust the volume, length, and curliness of the hair.

4. **Accessory Customization**:
   - In the "Accessories" tab, users can choose earrings, hair accessories, and necklaces.
   - Users can adjust the size and position of the accessories.

5. **Save and Load**:
   - In the top right corner, users can enter a character name and click the "Save" button to save the current character settings.
   - Clicking the "Load" button allows users to view the list of saved characters.
   - Users can select a saved character to load.

### Data Storage Structure

The format of saved character data is as follows:

```json
{
  "name": "Character Name 2025/03/22 12:18",
  "data": {
    "modelState": {
      "noseSize": 50,
      "eyeSize": 50,
      "mouthWidth": 50
    },
    "hairStyle": "short",
    "hairColor": "black",
    "earrings": "none",
    "hairAccessory": "none",
    "necklace": "none",
    "material": "silver",
    "hairParameters": {
      "volume": 50,
      "length": 50,
      "curl": 50
    }
  }
}
```

### Notes

- Each character can save up to 21 settings.
- The character name must be unique when saving.
- Ensure to use this application in a browser that supports IndexedDB.

### TODO list
[ ] Link hairstyles to the 3D head model  
[ ] Link accessories to the 3D head model  
[ ] Adjust 3D model for preset faces  
[ ] Adjust 3D Fusion Adjustments After Portrait Photography for preset faces  
[ ] Adjust preview layout for handheld devices  

### Contribution

Contributions of any kind are welcome! Please submit issues or pull requests.

### License

This project is licensed under the MIT License. For more details, please refer to the LICENSE file.

---

Thank you for using the Character Customization application! We hope you enjoy creating unique characters!