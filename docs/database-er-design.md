Database : Entity Relationship

- user_table
    - id  : uuid
    - name  : string 
    - device : string
    - type : enum  // civilian, military

- vision_capture
    - id : uuid
    - user_id <> connected to user_table : id
    - image_str <> base64 encoded stringg
    - co_ordinate <> string < > latitude/ longiture
    - capture_time <> timestamp :  time - image was captured
    - modified_time <>timestamp : recevied at server

- vision_analysis
    - id
    - vis_cap_id
    - text
