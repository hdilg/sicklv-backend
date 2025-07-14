
/*
  جميع البيانات البرمجية في هذا الملف شخصية وخاصة بصاحب الموقع فقط.
  لا يتم حفظ أو عرض أو مشاركة أي بيانات شخصية للزوار أو أي طرف ثالث.
  جميع العمليات تتم محلياً للاستخدام الشخصي فقط.
*/

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// حماية رؤوس HTTP + CSP متقدم
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// تفعيل CORS للسماح بالنطاق الحقيقي فقط
app.use(cors({
  origin: ['https://sicklv.shop'],
  optionsSuccessStatus: 200
}));

// تحديد حجم البيانات المرسلة
app.use(express.json({ limit: '10kb' }));

// تقديم ملفات الواجهة الأمامية بأمان
app.use(express.static(path.join(__dirname)));

// بيانات الإجازات المرضية (شخصية للاستخدام الداخلي فقط)
const leaves = [
  { serviceCode: "GSL25021372778", idNumber: "1088576044", name: "عبدالاله سليمان عبدالله الهديلج",
    reportDate: "2025-02-09", startDate: "2025-02-09", endDate: "2025-02-24",
    doctorName: "هدى مصطفى خضر دحبور", jobTitle: "استشاري", days: 16
  },
  { serviceCode: "GSL25021898579", idNumber: "1088576044", name: "عبدالاله سليمان عبدالله الهديلج",
    reportDate: "2025-02-25", startDate: "2025-02-25", endDate: "2025-03-26",
    doctorName: "جمال راشد السر محمد احمد", jobTitle: "استشاري", days: 30
  },
  { serviceCode: "GSL25022385036", idNumber: "1088576044", name: "عبدالاله سليمان عبدالله الهديلج",
    reportDate: "2025-03-27", startDate: "2025-03-27", endDate: "2025-04-17",
    doctorName: "جمال راشد السر محمد احمد", jobTitle: "استشاري", days: 22
  },
  { serviceCode: "GSL25022884602", idNumber: "1088576044", name: "عبدالاله سليمان عبدالله الهديلج",
    reportDate: "2025-04-18", startDate: "2025-04-18", endDate: "2025-05-15",
    doctorName: "هدى مصطفى خضر دحبور", jobTitle: "استشاري", days: 28
  },
  { serviceCode: "GSL25023345012", idNumber: "1088576044", name: "عبدالاله سليمان عبدالله الهديلج",
    reportDate: "2025-05-16", startDate: "2025-05-16", endDate: "2025-06-12",
    doctorName: "هدى مصطفى خضر دحبور", jobTitle: "استشاري", days: 28
  },
  { serviceCode: "GSL25062955824", idNumber: "1088576044", name: "عبدالاله سليمان عبدالله الهديلج",
    reportDate: "2025-06-13", startDate: "2025-06-13", endDate: "2025-07-11",
    doctorName: "هدى مصطفى خضر دحبور", jobTitle: "استشاري", days: 29
  }
];

// نقطة نهاية للاستعلام مع تحقق قوي من الإدخالات
app.post('/api/leave', (req, res) => {
  const { serviceCode, idNumber } = req.body;
  if (
    typeof serviceCode !== 'string' || typeof idNumber !== 'string' ||
    !/^[A-Za-z0-9]{8,20}$/.test(serviceCode) ||
    !/^[0-9]{10}$/.test(idNumber)
  ) {
    return res.status(400).json({ success: false, message: "البيانات غير صحيحة." });
  }
  const record = leaves.find(item =>
    item.serviceCode === serviceCode && item.idNumber === idNumber
  );
  if (record) {
    res.json({ success: true, record });
  } else {
    res.status(404).json({ success: false, message: "لا يوجد سجل مطابق." });
  }
});

// صفحة 404 في حال الوصول لمسار غير معروف
app.use((req, res) => {
  res.status(404).json({ success: false, message: "الصفحة غير موجودة." });
});

// تشغيل السيرفر على البورت المخصص
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ SickLV backend running on: https://sicklv.shop (port ${PORT})`));
