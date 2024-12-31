import cv2
import os
import datetime

# Initialize the webcam
camera = cv2.VideoCapture(0)  # 0 is the default webcam index
if not camera.isOpened():
    print("Error: Could not access the webcam.")
    exit()

# Load the Haar Cascade for face detection
cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(cascade_path)

# Directory to save images
save_dir = "captured_faces"
os.makedirs(save_dir, exist_ok=True)

print("Press 'q' to quit.")

while True:
    # Capture frame-by-frame
    ret, frame = camera.read()
    if not ret:
        print("Error: Unable to read from webcam.")
        break

    # Convert frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Draw rectangles around detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        # Save the captured image
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        image_path = os.path.join(save_dir, f"face_{timestamp}.jpg")
        face_img = frame[y:y+h, x:x+w]
        cv2.imwrite(image_path, face_img)
        print(f"Face captured and saved at {image_path}")

    # Display the frame with rectangles
    cv2.imshow('Face Detection', frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close windows
camera.release()
cv2.destroyAllWindows()