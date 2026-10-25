import requests
from fastapi import File, UploadFile, HTTPException, status
from fastapi import APIRouter

OCR_SPACE_API_KEY = "helloworld"  # Free public test key provided by OCR.space

router = APIRouter()

@router.post("/scan-image", summary="Upload an image and extract text via Cloud OCR API")
async def scan_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only image files are allowed.",
        )
    
    try:
        image_bytes = await file.read()
        
        # Send image to free cloud OCR API
        response = requests.post(
            "https://api.ocr.space/parse/image",
            files={"filename": (file.filename, image_bytes, file.content_type)},
            data={"apikey": OCR_SPACE_API_KEY, "language": "eng"}
        )
        
        result = response.json()
        if result.get("IsErroredOnProcessing"):
            raise HTTPException(status_code=500, detail="OCR processing failed.")
            
        parsed_text = result["ParsedResults"][0]["ParsedText"]
        
        return {
            "filename": file.filename,
            "extracted_text": parsed_text.strip()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process image: {str(e)}"
        )