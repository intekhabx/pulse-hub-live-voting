import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extName = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extName)
  }
})



const upload = multer({ storage: storage , 
  limits: {
    fileSize: 2 * 1024 * 1024 // 2mb limit
  }, 
  fileFilter: (req, file, cb)=>{
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/svg']

    if(allowed.includes(file.mimetype)){
      cb(null, true)
    }
    else{
      cb(new Error("file type not supported"));
    }
  }
})


export default upload;
