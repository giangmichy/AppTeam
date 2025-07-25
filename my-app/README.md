# React Native UI Base

## Cấu trúc thư mục

```
my-app/
├── assets/                     # Hình ảnh, fonts, icons...
│   ├── images/
│   └── fonts/
│
├── src/                        # Mọi source code chính
│   ├── api/                    # Gọi API từ Spring Boot
│   │   ├── axiosInstance.ts    # Khởi tạo axios
│   │   └── userApi.ts          # API user (login, register...)
│   ├── components/             # Component tái sử dụng
│   ├── constants/              # Biến chung như màu sắc, fonts
│   ├── i18n/                   # Đa ngôn ngữ
│   ├── navigation/             # Điều hướng
│   ├── screens/                # Giao diện chính
│   ├── store/                  # State toàn cục (Zustand)
│   ├── types/                  # TypeScript chung
│   ├── utils/                  # Hàm tiện ích
│   ├── validation/             # Schema validate (zod)
│   ├── App.tsx                 # Entry point
│   └── tailwind.config.js      # Nativewind config
│
├── .env                        # Biến môi trường
├── package.json
├── tsconfig.json
└── README.md
```

## Hướng dẫn phát triển UI
- Chỉ tập trung UI, tách biệt logic gọi API, store, types, ...
- BE tích hợp dễ dàng qua các file trong src/api, src/store, src/types.
- Sử dụng Zustand cho state, i18next cho đa ngôn ngữ, NativeWind cho style.

## Cài đặt
```bash
npm install
```

## Chạy app
```bash
npm start
```

## Thêm thư viện
- Quản lý state: Zustand
- Gọi API: Axios
- Đa ngôn ngữ: i18next
- Điều hướng: react-navigation
- Style: NativeWind (Tailwind cho React Native)
- Validation: zod

## Ghi chú
- Chỉ sửa trong src/ và assets/.
- Không commit file .env lên git.
- Để BE tích hợp chỉ cần sửa src/api, src/store, src/types. 