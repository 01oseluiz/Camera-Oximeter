package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import java.io.ByteArrayOutputStream;
import java.lang.Math;
import java.util.Hashtable;

import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Rect;

import org.opencv.android.Utils;
import org.opencv.imgproc.Imgproc;
import org.opencv.imgcodecs.Imgcodecs;

import android.util.Base64;

public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNOpenCvLibrary";
  }

  private Bitmap base64ToBitmap(String imageAsBase64) {
    BitmapFactory.Options options = new BitmapFactory.Options();
    options.inDither = true;
    options.inPreferredConfig = Bitmap.Config.ARGB_8888;

    byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
    Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

    return image;
  }

  private String bitmapToBase64(Bitmap image) {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    image.compress(Bitmap.CompressFormat.PNG, 100, outputStream);

    return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
  }


  public Hashtable<String, Integer> calcForeheadPosition(ReadableMap leftEyePosition, ReadableMap rightEyePosition, ReadableMap origin, double viewScale)
  {
    double leftX = leftEyePosition.getDouble("x");
    double leftY = leftEyePosition.getDouble("y");
    double rightX = rightEyePosition.getDouble("x");
    double rightY = rightEyePosition.getDouble("y");
    double originY = origin.getDouble("y");
    int width = (int) Math.floor(viewScale * ((1.5 * Math.abs(leftX - rightX))));
    int height = (int) Math.floor(viewScale * (0.9 * (leftY + rightY) / 2 - originY));
    int x = (int) Math.floor(viewScale * Math.min(rightX, leftX) - 0.16 * width);
    int y = (int) Math.floor(viewScale * (0.95 * originY));

    Hashtable<String, Integer> ans = new Hashtable<String,Integer>();
    ans.put("width", width);
    ans.put("height", height);
    ans.put("x", x);
    ans.put("y", y);
    return ans;
  }

  @ReactMethod
  public void cutImage(String imageAsBase64, ReadableMap leftEyePosition,
  ReadableMap rightEyePosition, ReadableMap origin, double viewScale, boolean flipImg,
  Callback errorCallback, Callback successCallback) {
    try {

      int x, y, width, height;

      Bitmap bitmapImg = this.base64ToBitmap(imageAsBase64);
      Mat img = new Mat();
      Utils.bitmapToMat(bitmapImg, img);

      if (flipImg) {
        Core.flip(img, img, 1);
      }

      Hashtable<String, Integer> forehead = calcForeheadPosition(leftEyePosition, rightEyePosition, origin, viewScale);

      width = forehead.get("width");
      height = forehead.get("height");
      x = forehead.get("x");
      y = forehead.get("y");

      Rect rect = new Rect(x, y, width, height);
      Mat croppedMat = img.submat(rect);
      Bitmap CroppedImage = Bitmap.createBitmap(croppedMat.cols(), croppedMat.rows(), Bitmap.Config.ARGB_8888);
      Utils.matToBitmap(croppedMat, CroppedImage);

      successCallback.invoke(this.bitmapToBase64(CroppedImage));
    } catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }

  public void checkForBlurryImage(String imageAsBase64, Callback errorCallback, Callback successCallback) {
    try {
      BitmapFactory.Options options = new BitmapFactory.Options();
      options.inDither = true;
      options.inPreferredConfig = Bitmap.Config.ARGB_8888;

      byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
      Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);


      // Bitmap image = decodeSampledBitmapFromFile(imageurl, 2000, 2000);
      int l = CvType.CV_8UC1; //8-bit grey scale image
      Mat matImage = new Mat();
      Utils.bitmapToMat(image, matImage);
      Mat matImageGrey = new Mat();
      Imgproc.cvtColor(matImage, matImageGrey, Imgproc.COLOR_BGR2GRAY);

      Bitmap destImage;
      destImage = Bitmap.createBitmap(image);
      Mat dst2 = new Mat();
      Utils.bitmapToMat(destImage, dst2);
      Mat laplacianImage = new Mat();
      dst2.convertTo(laplacianImage, l);
      Imgproc.Laplacian(matImageGrey, laplacianImage, CvType.CV_8U);
      Mat laplacianImage8bit = new Mat();
      laplacianImage.convertTo(laplacianImage8bit, l);

      Bitmap bmp = Bitmap.createBitmap(laplacianImage8bit.cols(), laplacianImage8bit.rows(), Bitmap.Config.ARGB_8888);
      Utils.matToBitmap(laplacianImage8bit, bmp);
      int[] pixels = new int[bmp.getHeight() * bmp.getWidth()];
      bmp.getPixels(pixels, 0, bmp.getWidth(), 0, 0, bmp.getWidth(), bmp.getHeight());
      int maxLap = -16777216; // 16m
      for (int pixel : pixels) {
          if (pixel > maxLap)
              maxLap = pixel;
      }

      // int soglia = -6118750;
      int soglia = -8118750;
      if (maxLap <= soglia) {
          System.out.println("is blur image");
      }

      successCallback.invoke(maxLap <= soglia);
    } catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }
}
