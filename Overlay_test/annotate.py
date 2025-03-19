import cv2
import json
import os

input_images="/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images"
output_json="/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images/annotations.json"

image_files=[f for f in os.listdir(input_images) if f.endswith(('.jpg','.png'))]

annotations={}

for image_name in image_files:
    image_path=os.path.join(input_images,image_name)
    image=cv2.imread(image_path)
    
    points=[]
    
    def click_event(event, x, y, flags, param):
        global points 
        if event == cv2.EVENT_LBUTTONDOWN:
            points.append((x, y))  
            print(f"Point added: {(x, y)}")
        if len(points)==2:
            text=input(f"Enter instruction for {image_name}")
            if image_name not in annotations:
                    annotations[image_name] = []
                    
            annotations[image_name].append({
                    "start": points[0],
                    "end": points[1],
                    "text": text,
                    "text_pos": (points[0][0] + 10, points[0][1] - 10)  
                })
            points=[]
    cv2.imshow(f"Annotating: {image_name}", image)
    cv2.setMouseCallback(f"Annotating: {image_name}", click_event)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

with open(output_json, "w") as file:
    json.dump(annotations, file, indent=4)

print(f"Annotations saved to {output_json}!")