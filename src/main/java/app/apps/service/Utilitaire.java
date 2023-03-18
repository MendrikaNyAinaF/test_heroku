package app.apps.service;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;

import app.apps.model.HasId;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import app.apps.model.Actor;
import app.apps.model.Character;
import app.apps.model.Gender;

public class Utilitaire {
     private static SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
     private static SimpleDateFormat formatter2 = new SimpleDateFormat("dd/MM/yyyy HH:mm");
     private static SimpleDateFormat formatter3 = new SimpleDateFormat("yyyy-MM-dd");
     private static SimpleDateFormat formatter4 = new SimpleDateFormat("yyyy-MM-dd HH:mm");

     public static String[] getImageBase64(InputStream imageStream, String format) throws Exception {
          byte[] imageBytes = IOUtils.toByteArray(imageStream);
          String[] image = new String[2];

          image[0] = format;
          image[1] = Base64.getEncoder().encodeToString(imageBytes);

          return image;
     }

     public static String[] getImageBase64(String multipart) throws Exception {
          String[] img = multipart.split("/");
          return img;
     }

     public static Map<String, Object> getRequestMultipart(HttpServletRequest request) throws Exception {
          Map<String, Object> map = new HashMap<String, Object>();
          try {
               List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
               for (FileItem item : items) {
                    if (item.isFormField()) {
                         map.put(item.getFieldName(), item.getString());
                         // traiter les champs de formulaire ici
                    } else {
                         String contentType = item.getContentType();
                         String temp[] = contentType.split("/");
                         String format = null;
                         String[] input = null;
                         if (temp.length > 1) {
                              format = temp[1];
                              input = getImageBase64(item.getInputStream(), format);
                              if (input[1] != null && !input[1].equals(""))
                                   map.put(item.getFieldName(), input);
                         }
                         // System.out.println(format + " " + contentType);
                         // traiter le fichier téléchargé ici
                    }
               }
          } catch (FileUploadException e) {
               e.printStackTrace();
               throw new Exception("probleme avec le soumission du formulaire, " + e.getMessage());
          }
          return map;
     }

     public static String formatDate(Date date) {
          return formatter.format(date);
     }

     public static String formatDateISO(Date date) {
          return formatter3.format(date);
     }

     public static String formatTime(Timestamp time) {
          return formatter2.format(time);
     }

     public static String formatTimeISO(Timestamp time) {
          return formatter4.format(time);
     }

     // function that get all the fields of a class even if it is a child class

     public static Field[] getAllFields(Class<?> type) {
          Field[] fields = type.getDeclaredFields();
          if (type.getSuperclass() != null) {
               Field[] superFields = getAllFields(type.getSuperclass());
               Field[] allFields = new Field[fields.length + superFields.length];
               System.arraycopy(fields, 0, allFields, 0, fields.length);
               System.arraycopy(superFields, 0, allFields, fields.length, superFields.length);
               return allFields;
          } else {
               return fields;
          }
     }

     /*     
     */

}
