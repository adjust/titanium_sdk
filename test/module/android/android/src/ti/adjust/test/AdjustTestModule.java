//
//  AdjustModule.java
//  Adjust SDK
//
//  Created by Uglješa Erceg (@uerceg) on 30th July 2018.
//  Copyright © 2018 Adjust GmbH. All rights reserved.
//

package ti.adjust.test;

import java.util.List;
import java.util.ArrayList;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.kroll.common.Log;
import org.appcelerator.kroll.common.TiConfig;
import org.appcelerator.kroll.runtime.v8.V8Function;
import org.appcelerator.titanium.TiApplication;
import com.adjust.testlibrary.*;

@Kroll.module(name="AdjustTest", id="ti.adjust.test")
public class AdjustTestModule extends KrollModule implements ICommandRawJsonListener {
	private static final String LCAT = "AdjustTestModule";

    private int order;
	private TestLibrary testLibrary;
    private List<String> selectedTests = new ArrayList<String>();
    private List<String> selectedTestDirs = new ArrayList<String>();
    private V8Function jsCommandExecutorCallback;

	public AdjustTestModule() {
		super();
	}

	@Kroll.onAppCreate
	public static void onAppCreate(TiApplication app) {
		Log.d(LCAT, "inside onAppCreate");
	}

	@Override
	public void executeCommand(String json) {
		Object[] answer = { json, this.order };
		this.jsCommandExecutorCallback.call(getKrollObject(), answer);
        this.order += 1;
	}

	@Kroll.method
    public void initialize(String baseUrl, final V8Function callback) {
        order = 0;
    	testLibrary = new TestLibrary(baseUrl, this);

        for (int i = 0; i < selectedTests.size(); i++) {
            testLibrary.addTest(selectedTests.get(i));
        }
        for (int i = 0; i < selectedTestDirs.size(); i++) {
            testLibrary.addTestDirectory(selectedTestDirs.get(i));
        }

        this.jsCommandExecutorCallback = callback;
    }

    @Kroll.method
    public void addTestDirectory(String testDir) {
    	this.selectedTestDirs.add(testDir);
    }

    @Kroll.method
    public void addTest(String test) {
    	this.selectedTests.add(test);
    }

    @Kroll.method
    public void startTestSession(String clientSdk) {
    	if (testLibrary != null) {
    		testLibrary.startTestSession(clientSdk);
    	}
    }

    @Kroll.method
    public void addInfoToSend(String key, String value) {
    	if (testLibrary != null) {
            testLibrary.addInfoToSend(key, value);
        }
    }

    @Kroll.method
    public void sendInfoToServer(String basePath) {
    	if (testLibrary != null) {
            testLibrary.sendInfoToServer(basePath);
        }
    }
}
