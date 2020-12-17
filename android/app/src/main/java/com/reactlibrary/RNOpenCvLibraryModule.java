package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import java.io.ByteArrayOutputStream;
import java.lang.Math;
import java.util.Hashtable;

import java.util.ArrayList;
import java.util.List;

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
  private List<Mat> foreheadImages;
  private Integer maxFrames = 30;

  public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.foreheadImages = new ArrayList<Mat>();
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

  private String matToBase64(Mat img) {
    Bitmap CroppedImage = Bitmap.createBitmap(img.cols(), img.rows(), Bitmap.Config.ARGB_8888);
    Utils.matToBitmap(img, CroppedImage);
    return this.bitmapToBase64(CroppedImage);
  }

  private String bitmapToBase64(Bitmap image) {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    image.compress(Bitmap.CompressFormat.PNG, 100, outputStream);

    return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
  }

  private void saveImage(Mat img) {
    if (this.foreheadImages.size() >= this.maxFrames) {
      this.foreheadImages.remove(0);
    }

    this.foreheadImages.add(img);
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

  public Mat cutImage(String imageAsBase64, ReadableMap leftEyePosition,
  ReadableMap rightEyePosition, ReadableMap origin, double viewScale, boolean flipImg) {
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
    return croppedMat;
  }

  @ReactMethod
  public void runOximeter(String imageAsBase64, ReadableMap leftEyePosition,
  ReadableMap rightEyePosition, ReadableMap origin, double viewScale, boolean flipImg,
  Callback errorCallback, Callback successCallback) {
    try {
      WritableMap map = Arguments.createMap();

      // Save current cropped image
      Mat croppedMat = this.cutImage(imageAsBase64, leftEyePosition, rightEyePosition, origin, viewScale, flipImg);
      this.saveImage(croppedMat);

      // Add img as string base64 to be returned to react component
      map.putString("croppedImage", this.matToBase64(croppedMat));

      successCallback.invoke(map);
    } catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }
}
