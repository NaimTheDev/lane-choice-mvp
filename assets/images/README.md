# Lane Choice App - Image Assets Guide

This guide lists all the images you need to download and place in the appropriate folders to replace the placeholder images in the Lane Choice app.

## 📁 Folder Structure
```
assets/images/
├── cars/           # Car photos for posts, profiles, and voting
├── users/          # User profile pictures and cover photos
├── groups/         # Group banner images
└── events/         # Event cover photos
```

## 🚗 Car Images (`assets/images/cars/`)

### Classic Cars
- `mustang_1966_sunset.jpg` - 1966 Ford Mustang at sunset (600x400)
- `mustang_1966_profile.jpg` - 1966 Ford Mustang side profile (600x800)
- `mustang_1966_garage.jpg` - 1966 Ford Mustang in garage (400x400)

### JDM Cars
- `silvia_s15_drift.jpg` - Nissan Silvia S15 drifting (600x400)
- `silvia_s15_profile.jpg` - Nissan Silvia S15 side profile (600x800)
- `civic_type_r.jpg` - Honda Civic Type R (600x400)
- `rx7_fd_night.jpg` - Mazda RX-7 FD at night (600x400)

### European Cars
- `bmw_m3_e92.jpg` - BMW M3 E92 (600x400)
- `porsche_911_964.jpg` - Porsche 911 (964) classic (600x400)

### Off-Road/Trucks
- `jeep_wrangler_mud.jpg` - Jeep Wrangler in mud (600x400)
- `jeep_wrangler_trail.jpg` - Jeep Wrangler on trail (600x800)

### Luxury/Supercars
- `lamborghini_urus.jpg` - Lamborghini Urus in desert (600x400)
- `chevy_impala_1964.jpg` - 1964 Chevy Impala lowrider (600x400)

## 👤 User Images (`assets/images/users/`)

### Profile Pictures (100x100)
- `alex_ryder.jpg` - Young male car enthusiast
- `mia_chen.jpg` - Asian female drift enthusiast
- `ben_carter.jpg` - European male BMW enthusiast
- `chloe_davis.jpg` - Female off-road enthusiast
- `marcus_holloway.jpg` - Male tuner enthusiast
- `sophia_rossi.jpg` - Female classic car enthusiast
- `leo_garcia.jpg` - Male lowrider enthusiast
- `isabelle_dubois.jpg` - Female rally enthusiast
- `kenji_tanaka.jpg` - Male JDM enthusiast
- `fatima_al_jamil.jpg` - Female supercar enthusiast

### Cover Photos (1200x300)
- `garage_cover_1.jpg` - Modern garage with tools
- `garage_cover_2.jpg` - Classic car garage
- `garage_cover_3.jpg` - Racing garage with trophies
- `garage_cover_4.jpg` - Off-road garage setup
- `garage_cover_5.jpg` - JDM garage aesthetic

## 👥 Group Images (`assets/images/groups/`)

### Group Banners (800x450)
- `street_racers_banner.jpg` - Night city street racing scene
- `drifters_banner.jpg` - Car drifting with smoke
- `show_shine_banner.jpg` - Polished cars at car show
- `jdm_legends_banner.jpg` - Japanese cars at night
- `german_engineering_banner.jpg` - German cars on highway
- `offroad_trailblazers_banner.jpg` - Off-road adventure in mountains

## 🎉 Event Images (`assets/images/events/`)

### Event Covers (800x450)
- `cars_coffee_downtown.jpg` - Cars parked at coffee shop
- `midnight_touge_run.jpg` - Cars on mountain road at night
- `drag_strip_event.jpg` - Drag racing event
- `car_show_weekend.jpg` - Car show with multiple vehicles
- `drift_competition.jpg` - Drift competition event

## 🔍 Where to Find These Images

### Free Stock Photo Sites (with car-friendly licenses):
1. **Unsplash** (unsplash.com)
   - Search: "classic car", "sports car", "drift car", "garage"
   - High quality, free for commercial use

2. **Pexels** (pexels.com)
   - Search: "car enthusiast", "racing", "automotive"
   - Free for commercial use

3. **Pixabay** (pixabay.com)
   - Search: "automobile", "racing", "car show"
   - Free for commercial use

### Specific Search Terms:
- **For Cars**: "1966 mustang", "nissan silvia", "bmw m3", "car photography"
- **For People**: "car enthusiast", "mechanic portrait", "racing driver"
- **For Groups**: "car meet", "racing community", "automotive culture"
- **For Events**: "cars and coffee", "car show", "racing event"

## 📐 Image Specifications

### Required Sizes:
- **Profile Pictures**: 100x100px (square)
- **Cover Photos**: 1200x300px (4:1 ratio)
- **Car Photos**: 600x400px (3:2 ratio) or 600x800px (3:4 ratio for profiles)
- **Group Banners**: 800x450px (16:9 ratio)
- **Event Covers**: 800x450px (16:9 ratio)
- **Garage Photos**: 400x400px (square)

### Format Requirements:
- **Format**: JPG or PNG
- **Quality**: High resolution for crisp display
- **File Size**: Keep under 2MB per image for app performance

## 🎨 Style Guidelines

### Car Photos:
- High contrast, vibrant colors
- Good lighting (golden hour preferred)
- Clean backgrounds
- Show car's personality/style

### User Photos:
- Diverse representation
- Automotive/racing themed when possible
- Professional but approachable

### Group/Event Photos:
- Community-focused
- Action shots when appropriate
- Represent the car culture/scene

## 📝 Naming Convention

Use the exact filenames listed above to match the code references. For example:
- `mustang_1966_sunset.jpg` (not `mustang.jpg`)
- `alex_ryder.jpg` (not `profile1.jpg`)

## 🚀 After Adding Images

1. Place images in the correct folders
2. Run `flutter pub get` to refresh assets
3. Hot reload the app to see the new images
4. Test on different screen sizes to ensure images look good

## 💡 Pro Tips

1. **Optimize Images**: Use tools like TinyPNG to compress images without losing quality
2. **Consistent Style**: Try to maintain a consistent photography style across similar image types
3. **Backup**: Keep original high-res versions in case you need to resize later
4. **Legal**: Always check licensing - stick to royalty-free or Creative Commons images

---

**Note**: The app currently uses placeholder URLs. Once you add these local assets, you'll need to update the MockDataService to reference the local asset paths instead of the placeholder URLs.